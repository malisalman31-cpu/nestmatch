import { DEFAULT_PROFILES, fitWithin, hydrateProfiles, normalizeProfile, profileInitials, PROFILE_LIMITS, validatePhoto } from "./profiles.js";

const STORAGE_KEY = "nestmatch-profiles-v1";

export function setupProfileEditor({ getRole, showToast, storage = localStorage }) {
  const elements = {
    dialog: document.querySelector("#profile-dialog"), form: document.querySelector("#profile-form"), open: document.querySelector("#profile-button"), summary: document.querySelector("#profile-summary"), avatar: document.querySelector("#profile-avatar"), name: document.querySelector("#profile-name"), meta: document.querySelector("#profile-meta"), title: document.querySelector("#profile-dialog-title"), displayName: document.querySelector("#profile-display-name"), about: document.querySelector("#profile-about"), hobbies: document.querySelector("#profile-hobbies"), passions: document.querySelector("#profile-passions"), personalInput: document.querySelector("#profile-photos"), listingInput: document.querySelector("#listing-photos"), personalPreview: document.querySelector("#profile-photo-preview"), listingPreview: document.querySelector("#listing-photo-preview"), listingSection: document.querySelector("#listing-photo-section"), clear: document.querySelector("#clear-profile"),
  };
  let profiles = readProfiles(storage);
  let draftPersonal = [];
  let draftListing = [];

  function render() {
    const role = getRole(); const profile = profiles[role];
    elements.name.textContent = profile.displayName;
    const detail = [...profile.hobbies.slice(0, 2), ...profile.passions.slice(0, 1)];
    elements.meta.textContent = detail.length ? detail.join(" · ") : "Add photos, hobbies and passions";
    elements.avatar.replaceChildren();
    if (profile.personalPhotos[0]) elements.avatar.append(Object.assign(document.createElement("img"), { src: profile.personalPhotos[0], alt: "" }));
    else elements.avatar.textContent = profileInitials(profile.displayName);
  }

  function openEditor() {
    const role = getRole(); const profile = profiles[role];
    elements.title.textContent = role === "renter" ? "Build your renter profile" : "Build your landlord and listing profile";
    elements.listingSection.hidden = role !== "landlord";
    elements.displayName.value = profile.displayName; elements.about.value = profile.about; elements.hobbies.value = profile.hobbies.join(", "); elements.passions.value = profile.passions.join(", ");
    draftPersonal = [...profile.personalPhotos]; draftListing = [...profile.listingPhotos]; renderPreviews(); elements.dialog.showModal();
  }

  async function addPhotos(files, kind) {
    const maximum = kind === "personal" ? PROFILE_LIMITS.personalPhotos : PROFILE_LIMITS.listingPhotos;
    const target = kind === "personal" ? draftPersonal : draftListing;
    for (const file of [...files]) {
      if (target.length >= maximum) { showToast(`You can add up to ${maximum} photos here.`); break; }
      const validation = validatePhoto(file); if (!validation.valid) { showToast(validation.reason); continue; }
      try { target.push(await compressPhoto(file, kind)); } catch { showToast("That photo could not be processed."); }
    }
    renderPreviews();
  }

  function renderPreviews() {
    drawPhotoGrid(elements.personalPreview, draftPersonal, "personal"); drawPhotoGrid(elements.listingPreview, draftListing, "listing");
  }

  function drawPhotoGrid(container, photos, kind) {
    container.replaceChildren(...photos.map((src, index) => {
      const item = document.createElement("div"); item.className = "photo-preview";
      const image = Object.assign(document.createElement("img"), { src, alt: kind === "personal" ? `Personal photo ${index + 1}` : `Property photo ${index + 1}` });
      const remove = Object.assign(document.createElement("button"), { type: "button", textContent: "×", title: "Remove photo" });
      remove.addEventListener("click", () => { photos.splice(index, 1); renderPreviews(); }); item.append(image, remove); return item;
    }));
  }

  function save(event) {
    event.preventDefault(); const role = getRole();
    profiles[role] = normalizeProfile(role, { displayName: elements.displayName.value, about: elements.about.value, hobbies: elements.hobbies.value, passions: elements.passions.value, personalPhotos: draftPersonal, listingPhotos: draftListing });
    try { storage.setItem(STORAGE_KEY, JSON.stringify(profiles)); } catch { showToast("The photos are too large for this browser. Remove one and try again."); return; }
    render(); elements.dialog.close(); showToast("Your private profile was saved on this device.");
  }

  function clear() {
    const role = getRole(); profiles[role] = normalizeProfile(role, DEFAULT_PROFILES[role]);
    try { storage.setItem(STORAGE_KEY, JSON.stringify(profiles)); } catch {}
    const profile = profiles[role]; elements.displayName.value = profile.displayName; elements.about.value = ""; elements.hobbies.value = ""; elements.passions.value = ""; draftPersonal = []; draftListing = []; renderPreviews(); render(); showToast("Profile cleared.");
  }

  function reset() { profiles = hydrateProfiles(); try { storage.removeItem(STORAGE_KEY); } catch {} render(); }

  elements.open.addEventListener("click", openEditor); elements.summary.addEventListener("click", openEditor); elements.form.addEventListener("submit", save); elements.clear.addEventListener("click", clear);
  elements.personalInput.addEventListener("change", async (event) => { await addPhotos(event.target.files, "personal"); event.target.value = ""; });
  elements.listingInput.addEventListener("change", async (event) => { await addPhotos(event.target.files, "listing"); event.target.value = ""; });
  render();
  return { render, reset, getProfile: (role = getRole()) => profiles[role] };
}

function readProfiles(storage) { try { return hydrateProfiles(JSON.parse(storage.getItem(STORAGE_KEY))); } catch { return hydrateProfiles(); } }

async function compressPhoto(file, kind) {
  const source = await readDataUrl(file); const image = await loadImage(source);
  const bounds = kind === "personal" ? [900, 900] : [1400, 1000]; const size = fitWithin(image.naturalWidth, image.naturalHeight, ...bounds);
  const canvas = document.createElement("canvas"); canvas.width = size.width; canvas.height = size.height;
  canvas.getContext("2d", { alpha: false }).drawImage(image, 0, 0, size.width, size.height);
  return canvas.toDataURL("image/jpeg", .76);
}

function readDataUrl(file) { return new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.onerror = reject; reader.readAsDataURL(file); }); }
function loadImage(source) { return new Promise((resolve, reject) => { const image = new Image(); image.onload = () => resolve(image); image.onerror = reject; image.src = source; }); }
