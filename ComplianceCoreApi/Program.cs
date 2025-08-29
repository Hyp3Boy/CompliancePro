using System.Text;
using System.Threading.RateLimiting;
using ComplianceCore.Api.Data;
using ComplianceCore.Api.Dtos;
using ComplianceCore.Api.Middleware;
using ComplianceCore.Api.Models;
using ComplianceCore.Api.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

var myAppCorsPolicy = "myAppCorsPolicy";
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: myAppCorsPolicy,
                      policy =>
                      {
                          policy.WithOrigins("http://localhost:5173") // El origen de tu app React
                                .AllowAnyHeader()
                                .AllowAnyMethod();
                      });
});
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Por favor, introduce 'Bearer' [espacio] y después el token JWT",
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });
    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
            },
            Array.Empty<string>()
        }
    });

    options.AddSecurityDefinition("ApiKey", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Por favor, introduce tu API Key para el acceso a la búsqueda",
        Name = "X-Api-Key",
        Type = SecuritySchemeType.ApiKey,
        Scheme = "ApiKeyScheme"
    });
    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "ApiKey" },
                Scheme = "ApiKeyScheme",
                Name = "X-Api-Key",
                In = ParameterLocation.Header,
            },
            new List<string>()
        }
    });
});


builder.Services.AddScoped<IEntitySearchProvider, WorldBankClient>();
builder.Services.AddScoped<IEntitySearchProvider, ICIJClient>();
builder.Services.AddScoped<IEntitySearchProvider, OFACClient>();
builder.Services.AddScoped<IComplianceSearchService, ComplianceSearchService>();

builder.Services.AddSingleton<DapperContext>();
builder.Services.AddScoped<IProveedorRepository, ProveedorRepository>();
builder.Services.AddScoped<IUsuarioRepository, UsuarioRepository>();
builder.Services.AddScoped<ITokenService, TokenService>();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
        };
    });
builder.Services.AddAuthorization();

builder.Services.AddRateLimiter(options =>
{
    options.AddFixedWindowLimiter(policyName: "fixed", opt =>
    {
        opt.PermitLimit = 20;
        opt.Window = TimeSpan.FromMinutes(1);
        opt.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
        opt.QueueLimit = 5;
    });
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
});


var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseHttpsRedirection();
app.UseCors(myAppCorsPolicy);

app.UseRateLimiter();

app.UseMiddleware<ApiKeyAuthMiddleware>();

app.UseAuthentication();
app.UseAuthorization();


var searchApi = app.MapGroup("/api/search");

searchApi.MapGet("/", async (string entityName, IComplianceSearchService searchService) =>
{
    if (string.IsNullOrWhiteSpace(entityName))
    {
        return Results.BadRequest(new { Message = "El parámetro 'entityName' no puede estar vacío." });
    }

    var results = await searchService.SearchAllAsync(entityName);
    var response = new SearchResult(results.Count, results);
    return Results.Ok(response);
})
.WithName("SearchAllProviders")
.WithSummary("Busca una entidad en todas las listas de cumplimiento (Requiere API Key).")
.RequireRateLimiting("fixed")
.WithOpenApi();


var authApi = app.MapGroup("/api/auth").RequireRateLimiting("fixed");

authApi.MapPost("/register", async (UserRegisterDto dto, IUsuarioRepository repo) =>
{
    var existingUser = await repo.GetByUsernameAsync(dto.NombreUsuario);
    if (existingUser is not null)
    {
        return Results.Conflict("El nombre de usuario ya existe.");
    }
    
    var newUser = new Usuario
    {
        NombreUsuario = dto.NombreUsuario,
        CorreoElectronico = dto.CorreoElectronico,
        PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
        NombreCompleto = dto.NombreCompleto
    };

    var newUserId = await repo.CreateAsync(newUser);
    return Results.CreatedAtRoute("GetUserById", new { id = newUserId });
})
.WithName("RegisterUser");

authApi.MapPost("/login", async (UserLoginDto dto, IUsuarioRepository repo, ITokenService tokenService) =>
{
    var user = await repo.GetByUsernameAsync(dto.NombreUsuario);

    if (user is null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
    {
        return Results.Unauthorized();
    }
    
    var token = tokenService.CreateToken(user);
    
    var userInfo = new UserInfoDto(
        Id: user.UsuarioID.ToString(),
        Name: user.NombreCompleto,
        Email: user.CorreoElectronico
    );
    
    var response = new LoginSuccessResponseDto(
        AccessToken: token, 
        User: userInfo
    );

    return Results.Ok(response);
})
.WithName("LoginUser");


var proveedoresApi = app.MapGroup("/api/proveedores").RequireAuthorization();

proveedoresApi.MapGet("/", async (IProveedorRepository repo) =>
{
    var proveedores = await repo.GetAllAsync();
    return Results.Ok(proveedores);
});

proveedoresApi.MapGet("/{id:int}", async (int id, IProveedorRepository repo) =>
{
    var proveedor = await repo.GetByIdAsync(id);
    return proveedor is not null ? Results.Ok(proveedor) : Results.NotFound();
})
.WithName("GetProveedorById");

proveedoresApi.MapPost("/", async (CreateProveedorDto dto, IProveedorRepository repo) =>
{
    var proveedor = new Proveedor
    {
        RazonSocial = dto.RazonSocial,
        NombreComercial = dto.NombreComercial,
        IdentificacionTributaria = dto.IdentificacionTributaria,
        NumeroTelefonico = dto.NumeroTelefonico,
        CorreoElectronico = dto.CorreoElectronico,
        SitioWeb = dto.SitioWeb,
        DireccionFisica = dto.DireccionFisica,
        Pais = dto.Pais,
        FacturacionAnualUSD = dto.FacturacionAnualUSD,
        FechaUltimaEdicion = DateTime.UtcNow
    };
    var newId = await repo.CreateAsync(proveedor);
    var newProveedor = await repo.GetByIdAsync(newId);
    return Results.CreatedAtRoute("GetProveedorById", new { id = newId }, newProveedor);
});

proveedoresApi.MapPut("/{id:int}", async (int id, UpdateProveedorDto dto, IProveedorRepository repo) =>
{
    var existingProveedor = await repo.GetByIdAsync(id);
    if (existingProveedor is null) return Results.NotFound();

    existingProveedor.RazonSocial = dto.RazonSocial;
    existingProveedor.NombreComercial = dto.NombreComercial;
    existingProveedor.IdentificacionTributaria = dto.IdentificacionTributaria; // <-- AÑADIR ESTA LÍNEA
    existingProveedor.NumeroTelefonico = dto.NumeroTelefonico;
    existingProveedor.CorreoElectronico = dto.CorreoElectronico;
    existingProveedor.SitioWeb = dto.SitioWeb;
    existingProveedor.DireccionFisica = dto.DireccionFisica;
    existingProveedor.Pais = dto.Pais;
    existingProveedor.FacturacionAnualUSD = dto.FacturacionAnualUSD;

    var success = await repo.UpdateAsync(existingProveedor);
    return success ? Results.NoContent() : Results.Problem("Error al actualizar el proveedor.");
});

proveedoresApi.MapDelete("/{id:int}", async (int id, IProveedorRepository repo) =>
{
    var success = await repo.DeleteAsync(id);
    return success ? Results.NoContent() : Results.NotFound();
});


app.MapGet("/api/users/{id:int}", [Authorize] (int id) => {
    return Results.Ok(new { Message = $"Ruta para obtener usuario con ID {id}"});
}).WithName("GetUserById").ExcludeFromDescription();


app.Run();


public record SearchResult(int HitCount, List<Hit> Results);