export default function index(req, res, next) {
  res.json({
    more: false,
    results: [
      {
        id: 11,
        name: "Board Orientations",
        singular: "Board Orientation",
      },
      {
        id: 10,
        name: "New",
        singular: "new",
      },
      {
        id: 9,
        name: "Edge Styles",
        singular: "Edge Style",
      },
      {
        id: 8,
        name: "Arrangements",
        singular: "Arrangement",
      },
      {
        id: 7,
        name: "Sizes",
        singular: "Size",
      },
      {
        id: 6,
        name: "Grades",
        singular: "Grade",
      },
      {
        id: 5,
        name: "Surfaces",
        singular: "Surface",
      },
      {
        id: 4,
        name: "Weathering",
        singular: "Age",
      },
      {
        id: 3,
        name: "Surface Finishes",
        singular: "Finish",
      },
      {
        id: 2,
        name: "Coatings",
        singular: "Coating",
      },
      {
        id: 1,
        name: "Profiles",
        singular: "Profile",
      },
    ],
    status: "success",
  });
}
