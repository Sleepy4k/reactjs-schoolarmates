import GuestLayout from "../../layouts/GuestLayout";
import { useNavigate, A } from "@solidjs/router";
import { Component, createSignal } from "solid-js";
import { Api, Println, setStorage } from "../../utils/index";


const Login: Component = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = createSignal(false);
  const [data, setData] = createSignal({
    email: "",
    password: "",
  });
  
  const handleChange = (e: any) => {
    setData({ ...data(), [e.target.name]: e.target.value });
  }

  const handleValidation = () => {
    let formIsValid = true;
    setLoading(true);

    // Validasi buat Email
    if (!data().email) {
      formIsValid = false;
      Println("Login", "Email cannot be empty!", "error");
    } else if (typeof data().email !== "undefined") {
      let lastAtPos = data().email.lastIndexOf('@');
      let lastDotPos = data().email.lastIndexOf('.');

      if (!(lastAtPos < lastDotPos && lastAtPos > 0 && data().email.indexOf('@@') == -1 && lastDotPos > 2 && (data().email.length - lastDotPos) > 2)) {
        formIsValid = false;
        Println("Login", "Email is not valid!", "error");
      }
    }

    // Validasi buat Password
    if (!data().password) {
      formIsValid = false;
      Println("Login", "Password cannot be empty!", "error");
    } else if (typeof data().password !== "undefined") {
      if (data().password.length < 6) {
        formIsValid = false;
        Println("Login", "Password must be at least 6 characters!", "error");
      }
    }

    if (formIsValid) {
      handleSubmit();
    } else {
      setLoading(false);
    }
  }

  // submit Button
  const handleSubmit = async () => {
    Api.post("/login", data())
      .then((res) => {
        const value = res.data;

        if (value.status === "success") {
          Println("Login", value.message, "success");
          handleLogin(value.data[0]);
        } else if (value.status == "failed") {
          Println("Login", value.message, "error");
        } else {
          Println("Login", "Something went wrong!", "error");
        }
      })
      .catch((err) => {
        Println("Login", err.message, "error");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleLogin = (data: any) => {
    setStorage("user", data);
    navigate("/");
  }


  return (
    <>
      <GuestLayout onFinish={() => {}}>
      <section class="h-screen">
        <div class="py-12 h-full">
          <div class="flex justify-center items-center flex-wrap h-full g-6 text-gray-800">
            <div class="md:w-8/12 lg:w-6/12 mb-12 md:mb-0">
              <img
                src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg"
                class="w-full"
                alt="Phone image"
              />
            </div>
            <div class="md:w-8/12 lg:w-5/12 lg:ml-20">
              <form>

                <div class="mb-6">
                  <input 
                    type="email"
                    id="floatingEmail"
                    name="email"
                    placeholder="name@example.com"
                    value={data().email}
                    disabled={loading()} onchange={handleChange} 
                    class="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" required />
                    <label for="floatingEmail">Email address</label>
                </div>


                <div class="mb-6">
                  <input 
                    type="password" id="floatingPassword" name="password" placeholder="Password" value={data().password} disabled={loading()} onchange={handleChange} 
                    class="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                    required />
                    <label for="floatingPassword">Password</label>
                </div>

                <div class="flex justify-between items-center mb-6">
                  <div class="form-group form-check">
                    <input
                      type="checkbox" 
                      class="form-check-input appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                      id="exampleCheck3"
                      checked
                    />
                    <label class="form-check-label inline-block text-gray-800" for="exampleCheck2">Remember me</label>
                  </div>
                  <a
                    href="#!"
                    class="text-blue-600 hover:text-blue-700 focus:text-blue-700 active:text-blue-800 duration-200 transition ease-in-out"
                  >Forgot password?</a>
                </div>


                <button
                  type="submit" onclick={handleValidation} disabled={loading()}
                  class="inline-block px-7 py-3 bg-blue-600 text-white font-medium text-sm leading-snug uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out w-full"
                  data-mdb-ripple="true"
                  data-mdb-ripple-color="light">
                  Sign in
                </button>

                <div
                  class="flex items-center my-4 before:flex-1 before:border-t before:border-gray-300 before:mt-0.5 after:flex-1 after:border-t after:border-gray-300 after:mt-0.5">
                  <p class="text-center font-semibold mx-4 mb-0">OR</p>
                </div>

                <a
                  class="px-7 py-3 text-white font-medium text-sm leading-snug uppercase rounded shadow-md hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out w-full flex justify-center items-center mb-3" style="background-color: #3b5998"
                  href="/register"
                  data-mdb-ripple="true"
                  data-mdb-ripple-color="light">
                    Sign Up
                </a>
                
              </form>
            </div>
          </div>
        </div>
      </section>
    </GuestLayout>
    </>
  );
};

export default Login;