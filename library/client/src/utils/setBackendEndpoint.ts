export default function setBackendEndpoint(endpoint: string) {
	if (typeof window === "undefined")
		return ((global as any).mBlazeBackendendpoint = endpoint);
	else return ((window as any).mBlazeBackendendpoint = endpoint);
}
