export default function getBackendEndpoint() {
	((global || globalThis || window) as any).mBlazeBackendendpoint || null;
}
