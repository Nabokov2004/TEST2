import "./styles.css";
import {
  Book,
  BookInformation,
  User,
  ReviewInformation,
  Review
} from "./lib/types";
import { getBooks, getUsers, getReviews } from "./lib/api";
import { useEffect, useState, FC } from "react";
import Card from "./Card";

const App: FC = () => {
  const [books, setBooks] = useState<BookInformation[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchBooks = async () => {
      setIsLoading(true);
      try {
        const fetchedBooks: Book[] = await getBooks();
        const fetchedUsers: User[] = await getUsers();
        const fetchedReviews: Review[] = await getReviews();

        const booksWithInfo: BookInformation[] = fetchedBooks.map((book) => {
          const author: User | undefined = fetchedUsers.find(
            (user) => user.id === book.authorId
          );
          const reviews: ReviewInformation[] = fetchedReviews
            .filter((review) => book.reviewIds.includes(review.id))
            .map((review) => {
              const user: User | undefined = fetchedUsers.find(
                (user) => user.id === review.userId
              );
              return {
                id: review.id,
                user: user || { id: "", name: "Пользователь не найден" },
                text: review.text
              };
            });

          return {
            id: book.id,
            name: book.name || "Книга без названия",
            description: book.description,
            author: author || { id: "", name: "Автор не найден" },
            reviews
          };
        });

        setBooks(booksWithInfo);
        setIsLoading(false);
      } catch (error) {
        console.error("Ошибка при получении данных:", error);
        setIsLoading(false);
      }
    };
    fetchBooks();
  }, []);

  return (
    <div>
      <h1>Мои книги:</h1>
      {isLoading && <div>Загрузка...</div>}
      {!isLoading && books.map((b) => <Card key={b.id} book={b} />)}
    </div>
  );
};

export default App;
