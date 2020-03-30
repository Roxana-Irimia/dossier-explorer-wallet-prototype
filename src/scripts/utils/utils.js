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

export function validateSeed(seed) {
  console.log(seed);

  if (!seed || !seed.length) {
    return false;
  }

  return true;
}
