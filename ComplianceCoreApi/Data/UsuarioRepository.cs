using ComplianceCore.Api.Models;
using Dapper;

namespace ComplianceCore.Api.Data;

public interface IUsuarioRepository
{
    Task<Usuario?> GetByUsernameAsync(string username);
    Task<int> CreateAsync(Usuario usuario);
}

public class UsuarioRepository : IUsuarioRepository
{
    private readonly DapperContext _context;

    public UsuarioRepository(DapperContext context)
    {
        _context = context;
    }

    public async Task<Usuario?> GetByUsernameAsync(string username)
    {
        const string query = "SELECT * FROM Usuarios WHERE NombreUsuario = @Username";
        using var connection = _context.CreateConnection();
        return await connection.QuerySingleOrDefaultAsync<Usuario>(query, new { Username = username });
    }

    public async Task<int> CreateAsync(Usuario usuario)
    {
        const string query = @"
            INSERT INTO Usuarios (NombreUsuario, CorreoElectronico, PasswordHash, NombreCompleto)
            VALUES (@NombreUsuario, @CorreoElectronico, @PasswordHash, @NombreCompleto);
            SELECT CAST(SCOPE_IDENTITY() as int);
        ";
        using var connection = _context.CreateConnection();
        return await connection.QuerySingleAsync<int>(query, usuario);
    }
}