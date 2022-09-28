export const FIELD_DELETE_TYPE = "$MBlaze.delete";
export const FIELD_DELETE_OP_CODE = "$unset";

const fieldDelete = (field: string) => ({ [field]: "" });

export default fieldDelete;
