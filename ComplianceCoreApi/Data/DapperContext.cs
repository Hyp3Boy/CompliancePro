using System.Data;
using Microsoft.Data.SqlClient;

namespace ComplianceCore.Api.Data;

public class DapperContext
{
    private readonly string _connectionString;

    public DapperContext(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection")!;
    }

    public IDbConnection CreateConnection() => new SqlConnection(_connectionString);
}