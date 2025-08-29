using ComplianceCore.Api.Models;
using HtmlAgilityPack;
using Microsoft.Playwright;
using System.Diagnostics;
using System.Web;

namespace ComplianceCore.Api.Services;

public class ICIJClient : IEntitySearchProvider
{
    public string SourceName => "Offshore Leaks Database (ICIJ)";
    private readonly ILogger<ICIJClient> _logger;

    public ICIJClient(ILogger<ICIJClient> logger)
    {
        _logger = logger;
    }

    public async Task<List<Hit>> SearchAsync(string entityName)
    {
        var results = new List<Hit>();
        var encodedEntityName = HttpUtility.UrlEncode(entityName);
        var searchUrl = $"https://offshoreleaks.icij.org/search?q={encodedEntityName}&c=&j=&d=";

        _logger.LogInformation("Iniciando búsqueda en ICIJ: {SearchUrl}", searchUrl);

        using var playwright = await Playwright.CreateAsync();
        
        await using var browser = await playwright.Chromium.LaunchAsync(new() 
        { 
            Headless = true, // Mantenlo en 'false' para ver la magia
            SlowMo = 200      // Ralentiza un poco para que sea fácil seguirlo
        });
        
        var page = await browser.NewPageAsync();

        try
        {
            await page.GotoAsync(searchUrl, new() { Timeout = 30000 });
            _logger.LogInformation("Página cargada. Buscando el modal de disclaimer...");

            // Manejar el modal de disclaimer
            try
            {
                var checkboxSelector = "#accept";
                await page.Locator(checkboxSelector).WaitForAsync(new() { Timeout = 5000 });
                _logger.LogInformation("Modal de disclaimer detectado. Aceptando los términos...");
                await page.Locator(checkboxSelector).CheckAsync();
                await page.GetByRole(AriaRole.Button, new() { Name = "Submit" }).ClickAsync();
                _logger.LogInformation("Términos aceptados.");
            }
            catch (TimeoutException)
            {
                _logger.LogInformation("Modal de disclaimer no fue detectado, se continúa directamente.");
            }
            
            // --- NUEVO: LÓGICA DE PAGINACIÓN ---
            // Bucle para hacer clic en "More results" hasta que desaparezca
            var moreResultsButton = page.Locator("a#more_results.btn");
            int pageCount = 1;
            while (await moreResultsButton.IsVisibleAsync())
            {
                _logger.LogInformation("Cargando página de resultados #{PageCount}...", pageCount);
                await moreResultsButton.ClickAsync();
                // Esperamos a que la red se calme, lo que indica que los nuevos resultados han cargado.
                await page.WaitForLoadStateAsync(LoadState.NetworkIdle, new() { Timeout = 10000 });
                pageCount++;
            }
            _logger.LogInformation("No hay más resultados. Se han cargado todas las páginas.");
            // --- FIN DE LA LÓGICA DE PAGINACIÓN ---

            _logger.LogInformation("Extrayendo HTML de la página completamente cargada...");
            await page.ScreenshotAsync(new() { Path = "icij_final_page_screenshot.png", FullPage = true });

            var htmlContent = await page.ContentAsync();
            var htmlDoc = new HtmlDocument();
            htmlDoc.LoadHtml(htmlContent);

            var resultRows = htmlDoc.DocumentNode.SelectNodes("//table[contains(@class, 'table-sm')]/tbody/tr");

            if (resultRows != null)
            {
                _logger.LogInformation("Se encontraron {RowCount} filas totales en la tabla.", resultRows.Count);
                foreach (var row in resultRows)
                {
                    var cells = row.SelectNodes("td");
                    if (cells != null && cells.Count >= 4)
                    {
                        var hitData = new Dictionary<string, string>
                        {
                            { "Entity", cells[0].InnerText.Trim() },
                            { "Jurisdiction", cells[1].InnerText.Trim() },
                            { "Linked To", cells[2].InnerText.Trim() },
                            { "Data From", cells[3].InnerText.Trim() }
                        };
                        results.Add(new Hit { Source = SourceName, Data = hitData });
                    }
                }
                _logger.LogInformation("Se extrajeron {ResultCount} resultados totales de ICIJ para '{EntityName}'", results.Count, entityName);
            }
            else
            {
                 _logger.LogWarning("El selector de filas de la tabla no encontró nodos en el HTML para '{EntityName}'", entityName);
                 await File.WriteAllTextAsync("icij_debug_page.html", htmlContent);
            }
        }
        catch (TimeoutException tex)
        {
            _logger.LogError(tex, "Timeout durante la paginación o espera de selectores en ICIJ para '{EntityName}'.", entityName);
            await page.ScreenshotAsync(new() { Path = "icij_error_screenshot.png", FullPage = true });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error durante el web scraping de ICIJ.");
        }

        return results;
    }
}