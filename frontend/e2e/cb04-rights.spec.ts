import { expect, test } from "./fixtures";

test("CB04 : le membre crée et modifie, seul l'admin supprime", async ({ cookbook, member, uid }) => {
  await member.goto();
  const recipe = await member.createRecipe({ name: `Quiche ${uid}` });

  // Member: no delete button, but can edit.
  await member.goto(`/recipe/${recipe.id}`);
  const memberSheet = member.sheet();
  await expect(memberSheet.getByRole("heading", { level: 1 })).toHaveText(`Quiche ${uid}`);
  await expect(memberSheet.getByRole("button", { name: "Supprimer" })).toHaveCount(0);
  await memberSheet.getByRole("button", { name: "Modifier" }).click();
  await member.editor().locator('input[name="servings"]').fill("6 parts");
  await member.editor().getByRole("button", { name: "Enregistrer" }).click();
  await expect(memberSheet.locator("footer")).toContainText("Modifiée par Membre E2E");

  // The API refuses a delete from the member, not only the UI.
  const error = await member.page.evaluate(async (id) => {
    const app = document.querySelector("home-assistant") as unknown as { hass: { callWS(m: unknown): Promise<unknown> } };
    try {
      await app.hass.callWS({ type: "cookbook/delete", recipe_id: id });
      return null;
    } catch (e) {
      return (e as { code: string }).code;
    }
  }, recipe.id);
  expect(error).toBe("unauthorized");

  // Admin deletes after confirmation.
  await cookbook.goto(`/recipe/${recipe.id}`);
  await cookbook.sheet().getByRole("button", { name: "Supprimer" }).click();
  const dialog = cookbook.sheet().getByRole("alertdialog");
  await expect(dialog).toContainText(`« Quiche ${uid} » sera définitivement supprimée.`);
  await dialog.getByRole("button", { name: "Supprimer" }).click();
  await expect(cookbook.page).toHaveURL(/\/cookbook$/);
  await cookbook.search(uid);
  await expect(cookbook.panel.getByText("Aucune recette ne correspond à votre recherche.")).toBeVisible();
});
