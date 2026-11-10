package java8;

public class FunctionalInterface {

	public static void main(String[] args) {
		Print print = System.out::println;
		print.print("sujesh");
	}

}

interface Print{
	void print(String string);
}