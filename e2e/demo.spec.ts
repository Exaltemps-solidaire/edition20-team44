import { expect, test } from "@playwright/test";

// Démo du cas passant, de bout en bout. Chaque itération ajoute ses étapes (test.step).
test("Démo : le cas passant", async ({ page }) => {
  await test.step("J'ouvre l'application", async () => {
    await page.goto("/");
    await expect(page.locator("body")).toBeVisible();
  });

  await test.step("Je choisis un persona", async () => {
    await expect(page.getByRole("heading", { name: "Qui êtes-vous ?" })).toBeVisible();
    await page.getByRole("button", { name: /Amina Diallo/ }).click();
  });

  await test.step("Je vois le tableau de bord des sollicitations", async () => {
    await expect(page.getByRole("heading", { name: "Sollicitations" })).toBeVisible();
    await expect(page.getByText("Mairie de Paris")).toBeVisible();
  });
});
