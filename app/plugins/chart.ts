import { Chart, Title, Tooltip, Legend, BarElement, LineElement, PointElement, LineController, CategoryScale, LinearScale } from 'chart.js';

export default defineNuxtPlugin(() => {
  Chart.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, LineController, Title, Tooltip, Legend);
  Chart.defaults.font.family = 'Ark Pixel';
  Chart.defaults.font.size = 16;
  Chart.defaults.font.lineHeight = 1;
  Chart.defaults.color = 'white';
  Chart.defaults.plugins.tooltip.enabled = false;
});
