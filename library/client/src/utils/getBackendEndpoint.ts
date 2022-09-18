export default function getBackendEndpoint() {
	if (typeof window === "undefined")
		return (global as any).mBlazeBackendendpoint;
	else return (window as any).mBlazeBackendendpoint;
}
