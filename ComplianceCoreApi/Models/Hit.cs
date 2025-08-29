namespace ComplianceCore.Api.Models;

public class Hit
{
    /// <summary>
    /// La fuente de datos de donde proviene este resultado (ej. "The World Bank").
    /// </summary>
    public required string Source { get; set; }

    /// <summary>
    /// Un diccionario flexible para almacenar los datos específicos de cada fuente.
    /// Claves podrían ser "Firm Name", "Address", "Score", etc.
    /// </summary>
    public required Dictionary<string, string> Data { get; set; }
}