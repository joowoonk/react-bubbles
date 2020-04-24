import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
// import axios from "axios";
import { axiosWithAuth } from "../utils/axiosWithAuth";

const initialColor = {
  color: "",
  code: { hex: "" },
  // id: "",
};

const ColorList = ({ colors, updateColors }) => {
  // console.log(colors);
  const [editing, setEditing] = useState(false);
  const [colorToEdit, setColorToEdit] = useState(initialColor);
  const { push } = useHistory();
  // const { id } = useParams();
  console.log({ colorToEdit });

  const editColor = (color) => {
    setEditing(true);
    setColorToEdit(color);
  };

  const saveEdit = (e) => {
    e.preventDefault();
    axiosWithAuth()
      .put(`api/colors/${colorToEdit.id}`, colorToEdit)
      .then((res) => {
        console.log("res.data", res.data);
        const newColorList = colors.map((color) => {
          console.log("res.data.id", res.data.id);
          if (color.id === res.data.id) {
            return [res.data];
          }
          // console.log({ newColorList });
        });
        updateColors(...newColorList);
        push(`/colors/`);
        // useEffect(() => {}, [colorToEdit]);
      })
      .catch((err) => {
        console.log("Put Error", err);
      });
  };

  const addColor = (e) => {
    // e.preventDefault()

    axiosWithAuth()
      .post("/api/colors", colorToEdit)
      .then((res) => {
        console.log("props", res.data);
        updateColors(res.data);
        colors.push("/colors", res.data);
      })
      .catch((err) => {
        console.log("Error in AddFriend", err);
      });
  };

  const deleteColor = (color) => {
    // console.log("color", color);
    axiosWithAuth()
      .delete(`/api/colors/${color.id}`, colorToEdit)
      .then((res) => {
        // console.log({ colors });
        // console.log("res.data", res.data);
        const newList = colors.filter((item) => {
          return item.id !== res.data;
        });
        updateColors(newList);
        // console.log("response from delete", colorToEdit);
        push(`/colors`);
      })
      .catch((err) => console.log(err, "sorry, could not delete this color"));
  };

  return (
    <div className="colors-wrap">
      <p>colors</p>
      <button onClick={addColor}>Add A Blank Color</button>
      <ul>
        {colors.map((color) => (
          <li key={color.color} onClick={() => editColor(color)}>
            <span>
              <span
                className="delete"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteColor(color);
                }}
              >
                x
              </span>{" "}
              {color.color}
            </span>
            <div
              className="color-box"
              style={{ backgroundColor: color.code.hex }}
            />
          </li>
        ))}
      </ul>
      {editing && (
        <form onSubmit={saveEdit}>
          <legend>edit color</legend>
          <label>
            color name:
            <input
              onChange={(e) =>
                setColorToEdit({ ...colorToEdit, color: e.target.value })
              }
              value={colorToEdit.color}
            />
          </label>
          <label>
            hex code:
            <input
              onChange={(e) =>
                setColorToEdit({
                  ...colorToEdit,
                  code: { hex: e.target.value },
                })
              }
              value={colorToEdit.code.hex}
            />
          </label>
          <div className="button-row">
            <button type="submit">save</button>
            <button onClick={() => setEditing(false)}>cancel</button>
          </div>
        </form>
      )}
      <div className="spacer" />
      {/* stretch - build another form here to add a color */}
    </div>
  );
};

export default ColorList;
