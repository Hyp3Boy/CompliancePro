using System.Data;
using ComplianceCore.Api.Models;
using Dapper;

namespace ComplianceCore.Api.Data;

public interface IProveedorRepository
{
    Task<IEnumerable<Proveedor>> GetAllAsync();
    Task<Proveedor?> GetByIdAsync(int id);
    Task<int> CreateAsync(Proveedor proveedor);
    Task<bool> UpdateAsync(Proveedor proveedor);
    Task<bool> DeleteAsync(int id);
}

public class ProveedorRepository : IProveedorRepository
{
    private readonly DapperContext _context;

    public ProveedorRepository(DapperContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Proveedor>> GetAllAsync()
    {
        const string query = "SELECT * FROM Proveedores";
        using var connection = _context.CreateConnection();
        return await connection.QueryAsync<Proveedor>(query);
    }

    public async Task<Proveedor?> GetByIdAsync(int id)
    {
        const string query = "SELECT * FROM Proveedores WHERE ProveedorID = @Id";
        using var connection = _context.CreateConnection();
        return await connection.QuerySingleOrDefaultAsync<Proveedor>(query, new { Id = id });
    }
    
    public async Task<int> CreateAsync(Proveedor proveedor)
    {
        const string query = @"
            INSERT INTO Proveedores (RazonSocial, NombreComercial, IdentificacionTributaria, NumeroTelefonico, CorreoElectronico, SitioWeb, DireccionFisica, Pais, FacturacionAnualUSD)
            VALUES (@RazonSocial, @NombreComercial, @IdentificacionTributaria, @NumeroTelefonico, @CorreoElectronico, @SitioWeb, @DireccionFisica, @Pais, @FacturacionAnualUSD);
            SELECT CAST(SCOPE_IDENTITY() as int);
        ";
        using var connection = _context.CreateConnection();
        return await connection.QuerySingleAsync<int>(query, proveedor);
    }

    public async Task<bool> UpdateAsync(Proveedor proveedor)
    {
        const string query = @"
            UPDATE Proveedores SET
                RazonSocial = @RazonSocial,
                NombreComercial = @NombreComercial,
                IdentificacionTributaria = @IdentificacionTributaria,
                NumeroTelefonico = @NumeroTelefonico,
                CorreoElectronico = @CorreoElectronico,
                SitioWeb = @SitioWeb,
                DireccionFisica = @DireccionFisica,
                Pais = @Pais,
                FacturacionAnualUSD = @FacturacionAnualUSD,
                FechaUltimaEdicion = GETUTCDATE()
            WHERE ProveedorID = @ProveedorID;
        ";
        using var connection = _context.CreateConnection();
        var affectedRows = await connection.ExecuteAsync(query, proveedor);
        return affectedRows > 0;
    }
    
    public async Task<bool> DeleteAsync(int id)
    {
        const string query = "DELETE FROM Proveedores WHERE ProveedorID = @Id";
        using var connection = _context.CreateConnection();
        var affectedRows = await connection.ExecuteAsync(query, new { Id = id });
        return affectedRows > 0;
    }
}