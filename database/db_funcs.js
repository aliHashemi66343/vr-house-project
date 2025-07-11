import {shared_variables} from "../variables/shared_variables.js"

const get_json_from_db_result=(db_result)=>{

  
  return JSON.parse(JSON.stringify(db_result))
}
export const db_methods = {
  insert_record: async function (model_obj, data) {
    try {
      var created_record = await model_obj.create(data);
      return created_record;
      // new_obj.save();
    } catch (error) {
      if (error.code == 11000) {
        const field = Object.keys(error.keyValue)[0];
        throw new Error(`A record with same ${field} already exists`);
      } else {
        throw new Error(` Error ${error}`);
      }
    }
  },
  update_where_with_data: async function (
    model_obj,
    where_obj,
    data_to_update
  ) {
    try {
      await model_obj.updateOne(
        where_obj, // filter
        { $set: data_to_update } // update
      );
    } catch (error) {
      if (error.code == 11000) {
        const field = Object.keys(error.keyValue)[0];
        throw new Error(`A record with same ${field} already exists`);
      } else {
        throw new Error(` Error ${error}`);
      }
    }
  },

  select_data_fields_with_where: async function (
    model_obj,
    where_obj = {},
    fields = "*",
    limit = null,
    sort_by = { _id: 1 }, //1 for asc -1 for desc
    page = null
  ) {
    try {
      var return_records = null;

      var fields_obj = {};
      var fields_arr = fields.split(",");
      fields_arr.forEach((field_name) => {
        fields_obj[field_name] = 1;
      });
      if (!page) {
    

        return_records = await model_obj
          .find(
            where_obj, // where condition
            fields == "*" ? {} : fields_obj
          )
          .sort(sort_by)
          .limit(limit);
      } else {
        const skip = (page - 1) * shared_variables.perPage;
        return_records = await model_obj
          .find(where_obj, fields == "*" ? {} : fields_obj)
          .sort(sort_by)
          .skip(skip)
          .limit(shared_variables.perPage);
      }

      return return_records;
    } catch (error) {
      throw new Error(` Error ${error}`);
    }
  },
  get_table_single_record_by_where_obj: async function (
    model_obj,
    where_obj,
    fields = "*"
  ) {
    try {
      var record = await this.select_data_fields_with_where(
        model_obj,
        where_obj,
        fields
      );
      if (record == null) {
        return null;
      }
      record = record[0];

      return record;
    } catch (error) {
      throw new Error(error);
    }
  },

  delete_data_with_where: async function (model_obj, where_obj) {
    try {
      await model_obj.deleteMany(where_obj);
    } catch (error) {
      throw new Error("Error in Delete");
    }
  },
  get_count_of_records_with_where: async function (model_obj, where_obj = {}) {

    var result = await model_obj.find(where_obj).countDocuments();

    return result;
  },
};


