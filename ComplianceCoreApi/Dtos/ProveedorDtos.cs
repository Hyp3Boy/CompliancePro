using System.ComponentModel.DataAnnotations;

namespace ComplianceCore.Api.Dtos;

public record CreateProveedorDto(
    [Required] string RazonSocial,
    string? NombreComercial,
    [Required] string IdentificacionTributaria,
    string? NumeroTelefonico,
    [Required][EmailAddress] string CorreoElectronico,
    string? SitioWeb,
    string? DireccionFisica,
    [Required] string Pais,
    decimal? FacturacionAnualUSD
);

public record UpdateProveedorDto(
    [Required] string RazonSocial,
    string? NombreComercial,
    [Required] string IdentificacionTributaria, // <-- AÑADIR ESTA LÍNEA
    string? NumeroTelefonico,
    [Required][EmailAddress] string CorreoElectronico,
    string? SitioWeb,
    string? DireccionFisica,
    [Required] string Pais,
    decimal? FacturacionAnualUSD
);