package main

import (
	"context"
	"log"
	"math/rand"
	"sync"
)

// generateNumbers -генерирует числа в горутине
func generateNumbers(limit int, goNum int, numbers chan int, cancelOut chan func()) {
	numbersSet := Set[int]{data: make(map[int]bool)}

	ctx, cancel := context.WithCancel(context.Background())
	var lock sync.Mutex
	for i := 0; i < goNum; i++ {
		go func(ctx context.Context) {
			for {
				randomNumber := rand.Intn(limit + 1)
				lock.Lock()
				numbersLen := numbersSet.Len()
				if numbersLen >= limit {
					close(numbers)
					break
				}
				numberIsAdded := numbersSet.Add(randomNumber)
				select {
				case <-ctx.Done(): // if cancel() execute
					log.Println("Goroutine canceled")
					return
				default:
					if numberIsAdded {
						numbers <- randomNumber
					}
				}
				lock.Unlock()
			}
		}(ctx)
	}
	go func() {
		log.Println("Cancel return")
		cancelOut <- cancel
	}()
}
