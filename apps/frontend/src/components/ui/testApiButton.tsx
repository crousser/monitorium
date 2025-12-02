export const TestApiButton = (): JSX.Element => {
    const handleClickTestApiButton = async () => {
        try {
            const response = await fetch('/api/v1/health');

            if (!response.ok) {
                throw new Error(`HTTP ошибка! Статус: ${response.status}`);
            }

            const data = await response.json();
            console.log('Успешное подключение:', data);
        } catch (error) {
            console.error('Ошибка при подключении:', error);
        }
    };

    return (
        <button
            className="absolute left-0 top-0 bg-red-100 px-1 hover:opacity-90"
            onClick={handleClickTestApiButton}>
            Test API
        </button>
    );
};
