export const signup = (req, res) => {
  console.log("Signup controller called");
  res.json({ message: "Signup route working!" });
};

export const login = (req, res) => {
  console.log("Login controller called");
  res.json({ message: "Login route working!" });
};