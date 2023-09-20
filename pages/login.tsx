import { GetServerSideProps } from "next";
import { ClientSafeProvider, getProviders, signIn } from "next-auth/react";
import Image from "next/image";
import SpotifyLogo from "../assets/spotify-logo.png";
import "tailwindcss/tailwind.css";

interface Props {
  providers: Awaited<ReturnType<typeof getProviders>>;
}

const Login = ({ providers }: Props) => {
  const { name: providerName, id: providerID } =
    providers?.spotify as ClientSafeProvider;

  return (
    <div className="flex flex-col justify-center items-center bg-black h-screen">
      <div className="mb-6">
        <Image src={SpotifyLogo} alt="Spotify Logo" height={200} width={200} />
      </div>

      <button
        className="bg-[#18D860] text-white p-5 rounded-full"
        onClick={() => {
          signIn(providerID, { callbackUrl: "/" });
        }}>
        Login with {providerName}
      </button>
    </div>
  );
};

export default Login;

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  const providers = await getProviders();
  return {
    props: {
      providers,
    },
  };
};
