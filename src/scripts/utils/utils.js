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

export function closestParentElement(el, selector, stopSelector) {
  let retval = null;
  while (el) {
    if (el.matches(selector)) {
      retval = el;
      break;
    } else if (stopSelector && el.matches(stopSelector)) {
      break;
    }
    el = el.parentElement;
  }
  return retval;
}

export function hasClass(el, className) {
  return el.className.split(" ").indexOf(className) > -1;
}
