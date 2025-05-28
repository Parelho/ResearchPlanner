import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 font-sans">
            {/* Header */}
            <header className="text-center py-20 px-6">
                <h1 className="text-5xl font-bold text-gray-800 mb-4">
                    Bem-vindo ao <span className="text-blue-600">Research Planner</span>
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    Planeje seus projetos de pesquisa com precisão — estime tempo, defina preços e acompanhe o progresso com facilidade.
                </p>
                <Link
                    to="/Planner"
                    className="inline-block mt-8 bg-blue-600 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-700 transition"
                >
                    Começar agora
                </Link>
            </header>

            {/* Features */}
            <section className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                <FeatureCard
                    svg={clockSVG}
                    title="Estime o Tempo"
                    description="Divida seu projeto em tarefas e estime quanto tempo cada uma levará."
                />
                <FeatureCard
                    svg={dollarSVG}
                    title="Defina Preços"
                    description="Configure valores por hora e obtenha projeções automáticas de custo para o seu plano."
                />
                <FeatureCard
                    svg={checkSVG}
                    title="Acompanhe o Progresso"
                    description="Visualize o andamento das tarefas e mantenha seu projeto no cronograma."
                />
            </section>

            {/* Footer */}
            <footer className="text-center text-sm text-gray-500 py-6">
                &copy; {new Date().getFullYear()} Research Planner — Todos os direitos reservados.
                <br />
                Desenvolvido por{" "}
                <a
                    href="https://github.com/murilomolina"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                >
                    Murilo Molina
                </a>{" "}
                e{" "}
                <a
                    href="https://github.com/parelho"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                >
                    Vinicius Parelho
                </a>
            </footer>
        </div>
    );
}

const FeatureCard = ({ svg, title, description }) => (
    <div className="bg-white shadow-md rounded-xl p-6 text-center hover:shadow-lg transition">
        <div className="mb-4 mx-auto w-10 h-10">{svg}</div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
    </div>
);

const clockSVG = (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-full h-full text-blue-600">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6l4 2m4-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const dollarSVG = (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-full h-full text-green-600">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-10v2m0 10v2" />
    </svg>
);

const checkSVG = (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-full h-full text-purple-600">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
);
