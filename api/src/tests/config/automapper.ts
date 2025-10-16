import { createMap, createMapper } from '@automapper/core';
import { pojos } from '@automapper/pojos';

const mapper = createMapper({
  strategyInitializer: pojos()
});

// createMap(
//   mapper,
//   // Define your mapping here
// );

export { mapper };
