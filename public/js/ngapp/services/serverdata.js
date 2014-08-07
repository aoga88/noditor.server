function ServerData($http, $q) {
	return {
		find: function(conditions) {
			var defer = $q.defer();
			$http.post('/api/serverdata/find', conditions)
			.success(function(data) {
				defer.resolve(data);
			})
			.error(function(data) {
				defer.reject(data);
			});

			return defer.promise;
		},

		save: function(conditions, document) {
			var defer = $q.defer();
			$http.post('/api/serverdata', {
				conditions: conditions,
				document: document})
			.success(function(data) {
				defer.resolve(data);
			})
			.error(function(data) {
				defer.reject(data);
			});

			return defer.promise;
		},

		insert: function(document) {
			var defer = $q.defer();
			$http.put('/api/serverdata', document)
			.success(function(data) {
				defer.resolve(data);
			})
			.error(function(data) {
				defer.reject(data);
			});

			return defer.promise;
		},
	}
};