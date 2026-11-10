package multithread;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class ExecuterService {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		EvenAndOdd1 andEven = new EvenAndOdd1();
		ExecutorService executorService = Executors.newFixedThreadPool(2);
		executorService.execute( andEven::printOdd);
		executorService.execute(andEven::printEven);
		executorService.shutdown();
	}
	
	

}

class EvenAndOdd1 {
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
