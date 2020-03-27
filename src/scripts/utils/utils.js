export function equals(value, checkValue) {
  return value === checkValue;
}

export function modelEquals(chain, checkValue) {
  let model = this;

  return model.getChainValue(chain) === checkValue;
}
