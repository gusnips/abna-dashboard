/**
 * Utilitários de slug para identificadores de CSR amigáveis para URL
 *
 * Nomes de CSR contêm espaços, acentos e caixa mista (ex: "CSR Grande São
 * Paulo"). Esses helpers convertem de/para um slug estável e legível para que
 * cada CSR tenha uma URL limpa como /csr/csr-grande-sao-paulo.
 */

/**
 * Converte um nome de CSR em um slug amigável para URL.
 * Converte para minúsculas, remove acentos e substitui não-alfanuméricos por hífens.
 */
export function csrToSlug(csr: string): string {
    return csr
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // remove diacríticos
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

/**
 * Resolve um slug de volta para o nome do CSR correspondente de uma lista conhecida.
 * Retorna undefined quando nenhum CSR corresponde ao slug.
 */
export function slugToCSR(slug: string, csrs: string[]): string | undefined {
    return csrs.find((csr) => csrToSlug(csr) === slug);
}
