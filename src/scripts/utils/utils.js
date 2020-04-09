export function equals(value, checkValue) {
  return value === checkValue;
}

export function modelEquals(chain, checkValue) {
  let model = this;
  if (!model) {
    return false;
  }

  let modelValue = model.getChainValue(chain);

  return equals(modelValue, checkValue);
}

export function isChainEmpty(chain) {
  let model = this;
  if (!model) {
    return false;
  }

  let modelValue = model.getChainValue(chain);

  return !modelValue || !modelValue.length;
}

export function validateSeed(seed) {
  console.log(seed);

  if (!seed || !seed.length) {
    return false;
  }

  return true;
}

export function normalizeCamelCaseToDashed(source) {
  if (!source || typeof source !== "string" || source.length === 0) {
    return "";
  }

  return source
    .split("")
    .map((letter) => {
      if (letter === letter.toLowerCase()) {
        return letter;
      }

      return `-${letter.toLowerCase()}`;
    })
    .join("");
}

export function normalizeDashedToCamelCase(source) {
  if (!source || typeof source !== "string" || source.length === 0) {
    return "";
  }

  return source
    .split("-")
    .map((word, index) => {
      if (index === 0) {
        return word;
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join("");
}

export function getItemsChainForPath(path) {
  let model = this;
  let fullChain = "dossierDetails.items";

  if (!path || !path.length) {
    path = model.getChainValue("dossierDetails.currentPath");
  }

  if (!path || !path.length) {
    return null;
  }

  if (path.trim() === "/") {
    return fullChain;
  }

  let rootItems = model.dossierDetails.items;
  let splitPath = path.split("/");
  splitPath.forEach(function (path) {
    let idx = rootItems.findIndex((el) => el.name === path);
    fullChain = `${fullChain}.${idx}.items`;
  });

  return fullChain;
}
