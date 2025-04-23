import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios"; // axios 임포트

function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // 성공 메시지 상태 추가

  const navigate = useNavigate(); // 페이지 이동을 위한 훅

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage(""); // 기존의 성공 메시지 초기화

    if (password1 !== password2) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      const formData = new URLSearchParams();
      formData.append("username", username); // ✅ 입력된 username
      formData.append("email", email);       // ✅ email도 포함해야 한다면 여기도!
      formData.append("password", password1); // ✅ password1을 사용

      const response = await axios.post("http://localhost:8000/user/create", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      });

      // 응답으로 받은 메시지를 사용하여 성공 메시지 표시
      setSuccessMessage(response.data.message);
      
      // 2초 후 로그인 화면으로 리다이렉트
      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (err) {
      console.error("회원가입 실패:", err.response?.data || err.message);

      const detail = err.response?.data?.detail;

      if (Array.isArray(detail)) {
        setError(detail.map((e) => `${e.loc?.join(".")} - ${e.msg}`));
      } else {
        setError(detail || "회원가입 중 오류가 발생했습니다.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-transparent">
      <form
        onSubmit={handleRegister}
        className="bg-white p-8 rounded-xl shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-black">
          TeamTunes 가입하기 🎧
        </h2>

        {error && (
          <div className="text-red-500 text-sm mb-4 text-center">{error}</div>
        )}

        {successMessage && (
          <div className="text-green-500 text-sm mb-4 text-center">{successMessage}</div>
        )}

        <input
          type="text"
          placeholder="이름"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
          required
        />

        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
          required
        />

        <input
          type="password"
          placeholder="비밀번호"
          value={password1}
          onChange={(e) => setPassword1(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
          required
        />

        <input
          type="password"
          placeholder="비밀번호 확인"
          value={password2}
          onChange={(e) => setPassword2(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
          required
        />

        <button
          type="submit"
          className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
        >
          가입하기
        </button>

        <p className="mt-4 text-center text-sm text-right text-black">
          이미 계정이 있으신가요?{" "}
          <Link to="/" className="text-blue-500 hover:underline">
            로그인
          </Link>
        </p>
      </form>
    </div>
  );
}

export default RegisterPage;
