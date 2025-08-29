namespace ComplianceCore.Api.Models;

public class Proveedor
{
    public int ProveedorID { get; set; }
    public required string RazonSocial { get; set; }
    public string? NombreComercial { get; set; }
    public required string IdentificacionTributaria { get; set; }
    public string? NumeroTelefonico { get; set; }
    public required string CorreoElectronico { get; set; }
    public string? SitioWeb { get; set; }
    public string? DireccionFisica { get; set; }
    public required string Pais { get; set; }
    public decimal? FacturacionAnualUSD { get; set; }
    public DateTime FechaUltimaEdicion { get; set; }
}