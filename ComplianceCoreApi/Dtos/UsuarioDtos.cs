using System.ComponentModel.DataAnnotations;

namespace ComplianceCore.Api.Dtos;

public record UserRegisterDto(
    [Required] string NombreUsuario,
    [Required][EmailAddress] string CorreoElectronico,
    [Required] string Password,
    string? NombreCompleto
);

public record UserLoginDto(
    [Required] string NombreUsuario,
    [Required] string Password
);

// NUEVO DTO para la información del usuario
public record UserInfoDto(
    string Id,
    string? Name,
    string Email
);

// DTO MODIFICADO para la respuesta del login
public record LoginSuccessResponseDto(
    string AccessToken,
    UserInfoDto User
);