export function generateSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\u0980-\u09FF-]+/g, "") // Allow Bangla, alphanumeric, and hyphens
    .replace(/--+/g, "-") // Replace multiple hyphens with single hyphen
    .replace(/^-+/, "") // Remove hyphens from start
    .replace(/-+$/, ""); // Remove hyphens from end
}