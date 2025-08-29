namespace ComplianceCore.Api.Models;

public class Usuario
{
    public int UsuarioID { get; set; }
    public required string NombreUsuario { get; set; }
    public required string CorreoElectronico { get; set; }
    public required string PasswordHash { get; set; }
    public string? NombreCompleto { get; set; }
    public DateTime FechaCreacion { get; set; }
}