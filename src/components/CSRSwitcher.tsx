/**
 * CSRSwitcher - Dropdown para navegar entre relatórios de CSR
 *
 * Permite ao usuário trocar a página de detalhes da CSR atual para outra região
 * sem voltar para a visão geral. Navega para a rota CSR baseada em slug.
 */

import { useNavigate } from 'react-router-dom';
import { csrToSlug } from '../utils';

interface CSRSwitcherProps {
    /** Nome da CSR atualmente selecionada */
    current: string;
    /** Todos os nomes de CSR disponíveis */
    csrs: string[];
}

export function CSRSwitcher({ current, csrs }: CSRSwitcherProps) {
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const csr = e.target.value;
        if (csr && csr !== current) {
            navigate(`/csr/${csrToSlug(csr)}`);
        }
    };

    return (
        <div className="flex items-center gap-2">
            <label htmlFor="csr-switcher" className="text-sm font-medium text-gray-600">
                Trocar CSR:
            </label>
            <select
                id="csr-switcher"
                value={current}
                onChange={handleChange}
                className="px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm focus:outline-none focus:ring-2 focus:ring-abna-primary focus:border-abna-primary"
            >
                {csrs.map((csr) => (
                    <option key={csr} value={csr}>
                        {csr}
                    </option>
                ))}
            </select>
        </div>
    );
}
