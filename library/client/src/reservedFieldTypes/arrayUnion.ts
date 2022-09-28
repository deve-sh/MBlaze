const arrayUnion = (toInsert: any | Array<any>) => ({
	type: "$MBlaze.arrayUnion",
	toInsert,
});

export default arrayUnion;
