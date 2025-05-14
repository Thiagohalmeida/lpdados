import React, { useState } from 'react';

interface FormData {
  email: string;
  area: string;
  requestType: string;
  details: string;
}

const initialFormData: FormData = {
  email: '',
  area: '',
  requestType: 'nova-visao',
  details: ''
};

const Feedback: React.FC = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{
    type: 'success' | 'error',
    text: string
  } | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      // For demo purposes, we're simulating an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Validate email domain
      if (!formData.email.endsWith('@controlf5.com.br')) {
        throw new Error('Apenas emails do domínio @controlf5.com.br são permitidos.');
      }
      
      console.log('Form submitted:', formData);
      
      // Simulate successful submission
      setSubmitMessage({
        type: 'success',
        text: 'Feedback enviado com sucesso! Obrigado pela sua contribuição.'
      });
      
      // Reset form after successful submission
      setFormData(initialFormData);
      
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Erro ao enviar o feedback. Tente novamente.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="feedback" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-text-primary mb-2">Feedback</h2>
            <p className="text-text-secondary">
              Compartilhe suas sugestões, solicitações ou dúvidas sobre nossos dashboards e relatórios.
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="bg-gray-50 p-8 rounded-lg shadow-md">
            {submitMessage && (
              <div className={`mb-6 p-4 rounded-md ${
                submitMessage.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {submitMessage.text}
              </div>
            )}
            
            <div className="mb-6">
              <label 
                htmlFor="email" 
                className="block text-text-primary font-medium mb-2"
              >
                Email *
              </label>
              <input 
                type="email" 
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="seu.email@controlf5.com.br"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                required
              />
              <p className="mt-1 text-sm text-text-secondary">
                Apenas emails do domínio @controlf5.com.br são permitidos.
              </p>
            </div>
            
            <div className="mb-6">
              <label 
                htmlFor="area" 
                className="block text-text-primary font-medium mb-2"
              >
                Área
              </label>
              <input 
                type="text"
                id="area"
                name="area"
                value={formData.area}
                onChange={handleChange}
                placeholder="Ex: Marketing, Vendas, Operações"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
              />
            </div>
            
            <div className="mb-6">
              <label 
                htmlFor="requestType" 
                className="block text-text-primary font-medium mb-2"
              >
                Tipo de Solicitação *
              </label>
              <select 
                id="requestType"
                name="requestType"
                value={formData.requestType}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                required
              >
                <option value="nova-visao">Nova Visão</option>
                <option value="atualizacao">Atualização</option>
                <option value="correcao">Correção</option>
                <option value="sugestao">Sugestões</option>
              </select>
            </div>
            
            <div className="mb-6">
              <label 
                htmlFor="details" 
                className="block text-text-primary font-medium mb-2"
              >
                Detalhes *
              </label>
              <textarea 
                id="details"
                name="details"
                value={formData.details}
                onChange={handleChange}
                rows={5}
                placeholder="Descreva sua solicitação em detalhes..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                required
              />
            </div>
            
            <div className="text-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-3 bg-brand-primary text-white font-medium rounded-full transition duration-300 ${
                  isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'
                }`}
              >
                {isSubmitting ? 'Enviando...' : 'Enviar Feedback'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Feedback;