type PageErrorProps = {
    message?: string;
};

export function PageError({ message = "Ошибка загрузки данных" }: PageErrorProps) {
    return (
        <div className="p-10">
            <p className="text-red-500">{message}</p>
        </div>
    );
}