function Site($http, $q) {
	return {
		find: function(conditions) {
			var defer = $q.defer();
			$http.post('/api/site/find', conditions)
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
			$http.post('/api/site', {
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
	}
};