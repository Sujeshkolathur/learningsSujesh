package multithread;

public class OddAndEven {

	public static void main(String[] args) {
		EvenAndOdd evenAndOdd = new EvenAndOdd();
		Thread thread1 = new Thread(evenAndOdd::printEven);
		Thread thread2 = new Thread(evenAndOdd::printOdd);
		thread1.start();
		thread2.start();

	}

}

class EvenAndOdd {
	Object lock = new Object();
	boolean printOdd = false;

	public void printEven() {

		for (int i = 0; i < 100; i = i + 2) {
			synchronized (lock) {
				if (printOdd) {
					try {
						lock.wait();
					} catch (InterruptedException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				 
					
				}
				System.out.println(i);
				printOdd = true;
				lock.notify();

			}
		}

	}

	public void printOdd() {

		for (int i = 1; i < 100; i = i + 2) {
			synchronized (lock) {
				if (!printOdd) {
					try {
						lock.wait();
					} catch (InterruptedException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				
					
				}
				System.out.println(i);
				printOdd = false;
				lock.notify();

			}
		}

	}
}
