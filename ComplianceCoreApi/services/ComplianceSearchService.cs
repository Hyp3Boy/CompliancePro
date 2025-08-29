using ComplianceCore.Api.Models;

namespace ComplianceCore.Api.Services;

public class ComplianceSearchService : IComplianceSearchService
{
    private readonly IEnumerable<IEntitySearchProvider> _providers;
    private readonly ILogger<ComplianceSearchService> _logger;

    public ComplianceSearchService(IEnumerable<IEntitySearchProvider> providers, ILogger<ComplianceSearchService> logger)
    {
        _providers = providers;
        _logger = logger;
    }

    public async Task<List<Hit>> SearchAllAsync(string entityName)
    {
        _logger.LogInformation("Iniciando búsqueda en {ProviderCount} fuentes para: {EntityName}", _providers.Count(), entityName);

        var searchTasks = _providers.Select(provider => provider.SearchAsync(entityName)).ToList();

        var results = await Task.WhenAll(searchTasks);

        var allHits = results.SelectMany(list => list).ToList();
        
        _logger.LogInformation("Búsqueda global completada. Total de hits encontrados: {HitCount}", allHits.Count);

        return allHits;
    }
}