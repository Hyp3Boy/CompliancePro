using ComplianceCore.Api.Models;

namespace ComplianceCore.Api.Services;

/// <summary>
/// Define el contrato universal para cualquier servicio que busque entidades en una fuente de datos externa.
/// </summary>
public interface IEntitySearchProvider
{
    /// <summary>
    /// El nombre único de la fuente de datos que este proveedor representa.
    /// </summary>
    string SourceName { get; }

    /// <summary>
    /// Realiza una búsqueda asíncrona de una entidad por su nombre.
    /// </summary>
    /// <param name="entityName">El nombre de la entidad a buscar.</param>
    /// <returns>Una lista de 'Hits' encontrados en la fuente de datos.</returns>
    Task<List<Hit>> SearchAsync(string entityName);
}