import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
// import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';
// import { MeterProvider } from '@opentelemetry/sdk-metrics';
// import { metrics } from '@opentelemetry/api';

// const prometheusExporter = new PrometheusExporter({ port: 9464 });

// // Configure MeterProvider with PrometheusExporter directly
// const meterProvider = new MeterProvider({
//   readers: [prometheusExporter],
// });

// // Set meterProvider as the global metrics provider
// metrics.setGlobalMeterProvider(meterProvider);

export const sdk = new NodeSDK({
  instrumentations: [getNodeAutoInstrumentations()],
});
