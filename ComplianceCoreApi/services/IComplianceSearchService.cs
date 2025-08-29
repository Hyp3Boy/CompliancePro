using ComplianceCore.Api.Models;

namespace ComplianceCore.Api.Services;

public interface IComplianceSearchService
{
    /// <summary>
    /// Orquesta la búsqueda de una entidad en todos los proveedores registrados.
    /// </summary>
    /// <param name="entityName">El nombre de la entidad a buscar.</param>
    /// <returns>Una lista agregada con todos los 'Hits' de todas las fuentes.</returns>
    Task<List<Hit>> SearchAllAsync(string entityName);
}