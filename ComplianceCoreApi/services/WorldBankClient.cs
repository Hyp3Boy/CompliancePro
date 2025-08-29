using ComplianceCore.Api.Models;
using Microsoft.Playwright;
using System.Text.Json;

namespace ComplianceCore.Api.Services;

public class WorldBankClient : IEntitySearchProvider
{
    public string SourceName => "The World Bank";

    private const string PageUrl = "https://projects.worldbank.org/en/projects-operations/procurement/debarred-firms";
    private const string InterceptUrlPattern = "https://apigwext.worldbank.org/dvsvc/v1.0/json/APPLICATION/ADOBE_EXPRNCE_MGR/FIRM/SANCTIONED_FIRM";
    
    private readonly ILogger<WorldBankClient> _logger;

    public WorldBankClient(ILogger<WorldBankClient> logger)
    {
        _logger = logger;
    }

     public async Task<List<Hit>> SearchAsync(string entityName)
    {
        _logger.LogInformation("Iniciando búsqueda en World Bank para: {EntityName}", entityName);

        var jsonContent = await InterceptApiCallAsync();

        if (string.IsNullOrEmpty(jsonContent))
        {
            _logger.LogWarning("No se recibió contenido JSON desde la API de World Bank.");
            return new List<Hit>();
        }

        var fullList = ParseJson(jsonContent);

        // Usamos LINQ para filtrar la lista en memoria.
        var results = fullList
            .Where(hit =>
                hit.Data.TryGetValue("Firm Name", out var firmName) &&
                firmName != null &&
                firmName.Contains(entityName, StringComparison.OrdinalIgnoreCase))
            .ToList();

        _logger.LogInformation("Se encontraron {ResultCount} resultados en World Bank para '{EntityName}'", results.Count, entityName);
        return results;
    }

    private async Task<string?> InterceptApiCallAsync()
    {
        var tcs = new TaskCompletionSource<string?>();

        using var playwright = await Playwright.CreateAsync();
        await using var browser = await playwright.Chromium.LaunchAsync(new() { Headless = true });
        var page = await browser.NewPageAsync();

        page.Response += async (_, response) =>
        {
            if (response.Url.StartsWith(InterceptUrlPattern) && response.Status == 200)
            {
                var json = await response.TextAsync();
                tcs.TrySetResult(json); // Intentamos completar la tarea cuando la respuesta es recibida
            }
        };

        try
        {
            await page.GotoAsync(PageUrl, new() { Timeout = 20000 }); 

            var completedTask = await Task.WhenAny(tcs.Task, Task.Delay(20000));
            
            if (completedTask == tcs.Task)
            {
                return await tcs.Task;
            }
            
            _logger.LogError("Timeout: La llamada a la API de World Bank no fue interceptada en 20 segundos.");
            return null;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error durante la intercepción con Playwright.");
            return null;
        }
    }

    private List<Hit> ParseJson(string jsonContent)
    {
        var results = new List<Hit>();
        try
        {
            using var jsonDocument = JsonDocument.Parse(jsonContent);
            var root = jsonDocument.RootElement;

            if (root.TryGetProperty("response", out var response) &&
                response.TryGetProperty("ZPROCSUPP", out var dataArray) &&
                dataArray.ValueKind == JsonValueKind.Array)
            {
                foreach (var firmElement in dataArray.EnumerateArray())
                {
                    var hitData = new Dictionary<string, string>
                    {
                        { "Firm Name", firmElement.TryGetProperty("SUPP_NAME", out var fn) ? fn.GetString() ?? "N/A" : "N/A" },
                        { "Address", firmElement.TryGetProperty("SUPP_ADDR", out var ad) ? ad.GetString() ?? "N/A" : "N/A" },
                        { "Country", firmElement.TryGetProperty("COUNTRY_NAME", out var co) ? co.GetString() ?? "N/A" : "N/A" },
                        { "From Date", firmElement.TryGetProperty("DEBAR_FROM_DATE", out var fd) ? fd.GetString() ?? "N/A" : "N/A" },
                        { "To Date", firmElement.TryGetProperty("DEBAR_TO_DATE", out var td) ? td.GetString() ?? "N/A" : "N/A" },
                        { "Grounds", firmElement.TryGetProperty("DEBAR_REASON", out var gr) ? gr.GetString() ?? "N/A" : "N/A" }
                    };
                    results.Add(new Hit { Source = "The World Bank", Data = hitData });
                }
            }
        }
        catch (JsonException ex)
        {
            _logger.LogError(ex, "Error fatal al parsear el JSON de World Bank.");
        }
        return results;
    }
}