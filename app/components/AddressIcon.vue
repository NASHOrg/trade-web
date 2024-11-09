<script lang="ts" setup>
import MersenneTwister from 'mersenne-twister';
import Color from 'color';

const props = withDefaults(
  defineProps<{
    address: string;
    seed?: number;
    diameter?: number;
    shapeCount?: number;
    colors?: string[];
  }>(),
  {
    seed: Math.round(Math.random() * 10000000),
    diameter: 100,
    shapeCount: 4,
    colors: () => {
      return [
        '#01888C', // teal
        '#FC7500', // bright orange
        '#034F5D', // dark teal
        '#F73F01', // orangered
        '#FC1960', // magenta
        '#C7144C', // raspberry
        '#F3C100', // goldenrod
        '#1598F2', // lightning blue
        '#2465E1', // sail blue
        '#F19E02', // gold
      ];
    },
  },
);

const jazzicon = ref<null | any>();

const state = reactive({
  generator: undefined as MersenneTwister | undefined,
  svgns: 'http://www.w3.org/2000/svg',
});

function addressToNumber(address: string) {
  return parseInt(address.slice(2, 10), 16);
}

function genColor(colors: string[]) {
  // const rand = this.generator!.random()
  const idx = Math.floor(colors.length * state.generator!.random());
  const color = colors.splice(idx, 1)[0];
  return color;
}

function genShape(
  remainingColors: string[],
  diameter: number,
  i: number,
  total: number,
  svg: Element,
) {
  const center = diameter / 2;
  const shape = document.createElementNS(state.svgns, 'rect');
  shape.setAttributeNS(null, 'x', '0');
  shape.setAttributeNS(null, 'y', '0');
  shape.setAttributeNS(null, 'width', diameter.toString());
  shape.setAttributeNS(null, 'height', diameter.toString());
  const firstRot = state.generator?.random();
  const angle = Math.PI * 2 * firstRot!;
  const velocity
    = (diameter / total) * state.generator!.random() + (i * diameter) / total;
  const tx = Math.cos(angle) * velocity;
  const ty = Math.sin(angle) * velocity;
  const translate = 'translate(' + tx + ' ' + ty + ')';
  // Third random is a shape rotation on top of all of that.
  const secondRot = state.generator!.random();
  const rot = firstRot! * 360 + secondRot * 180;
  const rotate = 'rotate(' + rot.toFixed(1) + ' ' + center + ' ' + center + ')';
  const transform = translate + ' ' + rotate;
  shape.setAttributeNS(null, 'transform', transform);
  const fill = genColor(remainingColors);
  shape.setAttributeNS(null, 'fill', fill || '');
  svg.appendChild(shape);
}

function hueShift(colors: string[], generator: MersenneTwister): string[] {
  const wobble = 30;
  const amount = generator.random() * 30 - wobble / 2;
  return colors.map((hex) => {
    const color = Color(hex);
    color.rotate(amount);
    return color.hex();
  });
}

function newPaper(diameter: number, color: string) {
  const container = document.createElement('div');
  container.style.borderRadius = `${diameter / 2}px`;
  container.style.overflow = 'hidden';
  container.style.padding = '0px';
  container.style.margin = '0px';
  container.style.width = '' + diameter + 'px';
  container.style.height = '' + diameter + 'px';
  container.style.display = 'inline-block';
  container.style.background = color;
  return {
    container,
  };
}

function generateIdenticon(diameter: number, seed: number) {
  state.generator = new MersenneTwister(seed);
  const remainingColors = hueShift(props.colors.slice(), state.generator);
  const elements = newPaper(diameter, genColor(remainingColors) || '');
  const container = elements.container;
  const svg = document.createElementNS(state.svgns, 'svg');
  svg.setAttributeNS(null, 'x', '0');
  svg.setAttributeNS(null, 'y', '0');
  svg.setAttributeNS(null, 'width', diameter.toString());
  svg.setAttributeNS(null, 'height', diameter.toString());
  container.appendChild(svg);
  for (let i = 0; i < props.shapeCount - 1; i++) {
    genShape(remainingColors, diameter, i, props.shapeCount - 1, svg);
  }
  return container;
}

async function icon() {
  const seed = props.address.toLowerCase()
    ? addressToNumber(props.address)
    : props.seed;
  jazzicon.value.innerHTML = '';
  const el = await generateIdenticon(props.diameter, seed);
  await jazzicon.value.append(el);
}

watch(
  () => props,
  () => {
    icon();
  },
  {
    deep: true,
  },
);
onMounted(() => {
  icon();
});
</script>

<template>
  <div ref="jazzicon" />
</template>
