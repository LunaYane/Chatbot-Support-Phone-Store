function normalizeText(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

function parseBatteryMah(batteryText = '') {
  const match = batteryText.toString().match(/(\d{4,5})\s*m?ah/i);
  return match ? Number(match[1]) : 0;
}

function parseRamGb(ramText = '') {
  const match = ramText.toString().match(/(\d{1,2})\s*gb/i);
  return match ? Number(match[1]) : 0;
}

function parseMainCameraMp(cameraText = '') {
  const match = cameraText.toString().match(/(\d{2,3})\s*mp/i);
  return match ? Number(match[1]) : 0;
}

function buildRecommendationAttributes(phone) {
  const specs = phone.specifications || {};
  const processor = (specs.processor || '').toLowerCase();
  const batteryMah = parseBatteryMah(specs.battery);
  const ramGb = parseRamGb(specs.ram);
  const mainCameraMp = parseMainCameraMp(specs.camera);

  const isGamingChip =
    processor.includes('snapdragon 8') ||
    processor.includes('dimensity 9') ||
    processor.includes('apple a17') ||
    processor.includes('apple a16') ||
    processor.includes('tensor g3') ||
    processor.includes('gen 3');

  const suitable_for_gaming = isGamingChip || ramGb >= 12 || phone.price >= 18000000;
  const suitable_for_camera =
    mainCameraMp >= 64 ||
    (phone.description || '').toLowerCase().includes('camera') ||
    (phone.description || '').toLowerCase().includes('photography');
  const suitable_for_battery = batteryMah >= 5000;
  const suitable_for_basic_use = phone.price <= 12000000 || (!suitable_for_gaming && batteryMah >= 4500);

  return {
    suitable_for_gaming,
    suitable_for_camera,
    suitable_for_battery,
    suitable_for_basic_use
  };
}

function withRecommendation(phone) {
  if (
    phone.recommendation &&
    typeof phone.recommendation.suitable_for_gaming === 'boolean' &&
    typeof phone.recommendation.suitable_for_camera === 'boolean' &&
    typeof phone.recommendation.suitable_for_battery === 'boolean' &&
    typeof phone.recommendation.suitable_for_basic_use === 'boolean'
  ) {
    return phone;
  }

  return {
    ...phone,
    recommendation: buildRecommendationAttributes(phone)
  };
}

module.exports = {
  normalizeText,
  buildRecommendationAttributes,
  withRecommendation
};
