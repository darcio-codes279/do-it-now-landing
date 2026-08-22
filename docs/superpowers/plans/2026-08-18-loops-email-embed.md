# Loops Email Signup Embed Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Embed a Loops hosted signup form into the Do It Now landing page so visitors can join the mailing list.

**Architecture:** The landing page is a single self-contained HTML file (`Do It Now - Landing Page (Standalone).html`) whose inner app source is compressed inside a bundler manifest — the inner React components are not directly editable. The Loops embed script is injected into the outer HTML shell (before `</body>`), which is fully editable and runs independently of the bundle. No build step, no framework dependencies.

**Tech Stack:** Vanilla HTML, Loops hosted embed (JavaScript snippet from loops.so dashboard)

**Spec:** N/A — feature described inline in this plan.

## Global Constraints

- File to modify: `Do It Now - Landing Page (Standalone).html` (only file in repo root)
- Do not alter any `<script type="__bundler/...">` tags — this breaks the bundled app
- Do not alter existing `<style>` block in `<head>`
- Loops embed script must be added **before** `</body>`, after all bundler scripts
- The form must collect at minimum: email address
- No additional npm packages, build tools, or external CSS frameworks

---

### Task 1: Create Loops Form and Get Embed Code

**Files:**
- No code files modified in this task
- Produces: a Loops embed `<script>` snippet to use in Task 2

**Interfaces:**
- Produces: `<script src="https://loops.so/embed/[YOUR_FORM_ID].js" data-loops-form="[YOUR_FORM_ID]"></script>` (exact snippet copied from Loops dashboard)

- [ ] **Step 1: Create a Loops account**

  Go to https://app.loops.so and sign up (or log in).

- [ ] **Step 2: Create a new Form**

  In the Loops sidebar: **Audience → Forms → New Form**.
  - Form type: **Embedded** (renders inline on your page) or **Popup** (appears over the page). Embedded is recommended for a landing page.
  - Add fields: at minimum **Email** (required). Add **First Name** if you want a name field.
  - Set the mailing list or audience group the contact should be added to.

- [ ] **Step 3: Publish the form and copy the embed snippet**

  Click **Publish**, then go to the **Embed** tab. Copy the snippet — it looks like:

  ```html
  <script src="https://loops.so/embed/[YOUR_FORM_ID].js" data-loops-form="[YOUR_FORM_ID]"></script>
  ```

  Keep this snippet ready for Task 2. The exact script `src` URL and `data-loops-form` value come from your Loops dashboard — do not guess them.

- [ ] **Step 4: Verify the form URL works in isolation**

  Loops also provides a hosted form URL (e.g. `https://loops.so/f/[YOUR_FORM_ID]`). Open it in a browser and submit a test email. Confirm the contact appears in Loops under **Audience**.

---

### Task 2: Inject Loops Embed into the HTML File

**Files:**
- Modify: `Do It Now - Landing Page (Standalone).html` — add Loops `<script>` tag before `</body>`

**Interfaces:**
- Consumes: embed snippet from Task 1 (`<script src="..." data-loops-form="..."></script>`)
- Produces: a live email signup form visible on the landing page

- [ ] **Step 1: Open the HTML file**

  Open `Do It Now - Landing Page (Standalone).html` in your editor.

- [ ] **Step 2: Locate the closing `</body>` tag**

  Scroll to the very bottom of the file. You will see:

  ```html
    </script>

    <script type="__bundler/manifest">
    ...
    </script>

    <script type="__bundler/template">
    ...
    </script>

  </body>
  </html>
  ```

- [ ] **Step 3: Insert the Loops embed snippet before `</body>`**

  Paste the snippet from Task 1 directly before the closing `</body>` tag. The result should look like:

  ```html
      </script>

      <script type="__bundler/manifest">
      ...
      </script>

      <script type="__bundler/template">
      ...
      </script>

      <!-- Loops email signup -->
      <script src="https://loops.so/embed/[YOUR_FORM_ID].js" data-loops-form="[YOUR_FORM_ID]"></script>

  </body>
  </html>
  ```

  Replace `[YOUR_FORM_ID]` with the actual ID from your Loops dashboard.

- [ ] **Step 4: Save the file**

- [ ] **Step 5: Open the file in a browser and verify the form appears**

  Double-click the HTML file to open it in your browser (or use a local server: `python3 -m http.server 8080` then visit `http://localhost:8080/Do%20It%20Now%20-%20Landing%20Page%20(Standalone).html`).

  The Loops form should render on the page. If you chose **Embedded** type it appears inline; if **Popup** type it appears as an overlay or triggered by a button.

- [ ] **Step 6: Commit**

  ```bash
  git add "Do It Now - Landing Page (Standalone).html"
  git commit -m "feat: add Loops email signup embed to landing page"
  ```

---

### Task 3: End-to-End Verification

**Files:**
- No code changes — verification only

- [ ] **Step 1: Submit a test signup**

  Open the page in a browser. Enter a test email in the Loops form and submit it.

- [ ] **Step 2: Confirm contact appears in Loops**

  In the Loops dashboard go to **Audience → All Contacts**. The test email should appear within a few seconds.

- [ ] **Step 3: Confirm no bundled app regressions**

  Verify the main landing page still loads and functions correctly — the bundled app unpacks, the page renders, and no console errors appear related to the bundler.

- [ ] **Step 4: (Optional) Remove the test contact**

  In Loops, find the test contact and delete it to keep your list clean.

---

## Self-Review Checklist

- [x] Spec coverage: form creation, embed injection, and verification all covered
- [x] No placeholders — all steps contain exact instructions or explicit "copy from dashboard" notes with a reason
- [x] No build tooling introduced — plain HTML edit only
- [x] Bundler scripts are not touched
- [x] Commit included in Task 2
