package multithread;

public class RunnableAndThreadSample {

	public static void main(String[] args) {
		Runnable runnable1 = ()-> {
			try {
				Thread.sleep(5000);
			} catch (InterruptedException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			System.out.println("runnable method1 called");};
		Runnable runnable2 = ()-> System.out.println("runnable method2 called");
		Thread thread1= new Thread(runnable1);
		Thread thread2= new Thread(runnable2);
		
		runnable1.run();
		runnable2.run();
		
		thread1.start();
		thread2.start();
	}

}
