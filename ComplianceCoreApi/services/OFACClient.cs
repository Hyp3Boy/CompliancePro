using ComplianceCore.Api.Models;
using HtmlAgilityPack;
using Microsoft.Playwright;

namespace ComplianceCore.Api.Services;

public class OFACClient : IEntitySearchProvider
{
    public string SourceName => "OFAC Sanctions List";
    private const string SearchUrl = "https://sanctionssearch.ofac.treas.gov/";
    private readonly ILogger<OFACClient> _logger;

    public OFACClient(ILogger<OFACClient> logger)
    {
        _logger = logger;
    }

    public async Task<List<Hit>> SearchAsync(string entityName)
    {
        var results = new List<Hit>();
        _logger.LogInformation("Iniciando búsqueda en OFAC para: {EntityName}", entityName);

        using var playwright = await Playwright.CreateAsync();

        await using var browser = await playwright.Chromium.LaunchAsync(new() 
        { 
            Headless = true, 
            SlowMo = 100 
        });
        
        var page = await browser.NewPageAsync();

        try
        {
            await page.GotoAsync(SearchUrl, new() { Timeout = 30000 });

            await page.FillAsync("#ctl00_MainContent_txtLastName", entityName);
            await page.ClickAsync("#ctl00_MainContent_btnSearch");

            var resultTableSelector = "#gvSearchResults";
            await page.WaitForSelectorAsync(resultTableSelector, new() { Timeout = 20000 });
            
            await page.ScreenshotAsync(new() { Path = "ofac_debug_screenshot.png", FullPage = true });

            var htmlContent = await page.ContentAsync();
            var htmlDoc = new HtmlDocument();
            htmlDoc.LoadHtml(htmlContent);
            
            var resultRows = htmlDoc.DocumentNode.SelectNodes("//table[@id='gvSearchResults']/tbody/tr");

            if (resultRows != null)
            {
                 _logger.LogInformation("Se encontraron {RowCount} filas en la tabla de OFAC.", resultRows.Count);
                 
                // --- CORRECCIÓN AQUÍ: Eliminamos el .Skip(1) ---
                foreach (var row in resultRows)
                {
                    var cells = row.SelectNodes("td");
                    if (cells != null && cells.Count >= 6)
                    {
                        var hitData = new Dictionary<string, string>
                        {
                            { "Name", cells[0].InnerText.Trim() },
                            { "Address", cells[1].InnerText.Trim() },
                            { "Type", cells[2].InnerText.Trim() },
                            { "Program(s)", cells[3].InnerText.Trim() },
                            { "List", cells[4].InnerText.Trim() },
                            { "Score", cells[5].InnerText.Trim() }
                        };
                        results.Add(new Hit { Source = SourceName, Data = hitData });
                    }
                }
                 _logger.LogInformation("Se extrajeron {ResultCount} resultados de OFAC para '{EntityName}'", results.Count, entityName);
            }
            else
            {
                _logger.LogWarning("El selector de filas de la tabla no encontró nodos en el HTML de OFAC para '{EntityName}'.", entityName);
                await File.WriteAllTextAsync("ofac_debug_page.html", htmlContent);
            }
        }
        catch (TimeoutException tex)
        {
            _logger.LogError(tex, "Timeout esperando un selector en OFAC para '{EntityName}'. La página podría haber cambiado.", entityName);
            await page.ScreenshotAsync(new() { Path = "ofac_error_screenshot.png", FullPage = true });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Ocurrió un error inesperado al buscar en OFAC.");
        }

        return results;
    }
}