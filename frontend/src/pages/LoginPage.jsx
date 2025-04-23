import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import axios from "axios"; // axios 임포트

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate(); // 페이지 이동을 위한 훅
  const handleLogin = async(e) => {
    e.preventDefault();
    setError("");
    console.log("로그인 시도:", username, password);
    
  
  try {
    const formData = new URLSearchParams();
    formData.append("username", username); // ✅ 입력된 username
    formData.append("password", password); // ✅ password1을 사용


    const response = await axios.post("http://localhost:8000/user/login", formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',  // JSON 형식 지정
      },
    });

    console.log("로그인 성공:");
    alert("로그인이 완료되었습니다!");
    //navigate("/");
  } catch (err) {
    console.error("로그인 실패:", err.response?.data || err.message);

    const detail = err.response?.data?.detail;

    if (Array.isArray(detail)) {
      setError(detail.map((e) => `${e.loc?.join(".")} - ${e.msg}`));
    } else {
      setError(detail || "로그인 중 오류가 발생했습니다.");
    }};
  }
  return (
    <div className="flex items-center justify-center min-h-screen bg-transparent">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-xl shadow-md w-80"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-black">TeamTunes 로그인 🎵</h2>
        {error && (
        <div className="text-red-500 text-sm mb-4 text-center">{error}</div>
        )}

        
        
        {/* 그리드 레이아웃으로 변경 */}
        <div className="grid grid-cols-1 gap-4">
          <div className="w-full">
            <input
              type="username"
              placeholder="유저네임"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="p-2 border rounded w-full"
              required
            />
          </div>
          <div className="w-full">
            <input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-2 border rounded w-full"
              required
            />
          </div>
          {/* 로그인 버튼: 그리드 내에서 배치 */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 w-full"
            >
              로그인
            </button>
          </div>
        </div>

        {/* 계정이 없으면 회원가입 링크 */}
        <p className="mt-4 text-right text-sm">
          계정이 없으신가요?{" "}
          <Link to="/register" className="text-blue-500 hover:underline">
            회원가입
          </Link>
        </p>
      </form>
    </div>
  );
}

export default LoginPage;
